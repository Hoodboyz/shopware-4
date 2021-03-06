/**
 * Shopware 4.0
 * Copyright © 2012 shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 *
 * @category   Shopware
 * @package    Order
 * @subpackage View
 * @copyright  Copyright (c) 2012, shopware AG (http://www.shopware.de)
 * @version    $Id$
 * @author shopware AG
 */

//{namespace name=backend/order/main}

/**
 * Shopware UI - Order detail page
 *
 * todo@all: Documentation
 */
//{block name="backend/order/view/detail/overview"}
Ext.define('Shopware.apps.Order.view.detail.Overview', {

    /**
     * Define that the additional information is an Ext.panel.Panel extension
     * @string
     */
    extend:'Ext.form.Panel',

    /**
     * List of short aliases for class names. Most useful for defining xtypes for widgets.
     * @string
     */
    alias:'widget.order-overview-panel',

    /**
     * An optional extra CSS class that will be added to this component's Element.
     */
    cls: Ext.baseCSSPrefix + 'overview-panel',

    /**
     * A shortcut for setting a padding style on the body element. The value can either be a number to be applied to all sides, or a normal css string describing padding.
     */
    bodyPadding: 10,

    /**
     * True to use overflow:'auto' on the components layout element and show scroll bars automatically when necessary, false to clip any overflowing content.
     */
    autoScroll: true,

    /**
     * Contains all snippets for the view component
     * @object
     */
    snippets:{
        convert: {
            title: '{s name=overview/convert/title}Canceled Order{/s}',
            message: '{s name=overview/convert/message}This is a canceled order. You are able to convert this into a regular order.{/s}',
            button: '{s name=overview/convert/button}Convert this order now{/s}'
        },
        billing: {
            title: '{s name=overview/billing/title}Billing{/s}',
            button: '{s name=overview/billing/button}Show customer details{/s}'
        },
        shipping: {
            title: '{s name=overview/shipping/title}Shipping{/s}',
            button: '{s name=overview/shipping/button}Show customer details{/s}',
            different: '{s name=overview/shipping/different}The shipping and billing addresses do not match!{/s}'
        },
        payment: {
            title: '{s name=overview/payment/title}Payment{/s}',
            button: '{s name=overview/payment/button}Show customer details{/s}'
        },
        edit: {
            title: '{s name=overview/edit/title}Edit order{/s}',
            save: '{s name=overview/edit/save}Save{/s}',
            cancel: '{s name=overview/edit/cancel}Cancel{/s}',
            clearedDate: '{s name=overview/edit/cleared_date}Paid on{/s}',
            trackingCode: '{s name=overview/edit/tracking_code}Tracking code{/s}',
            shippingCost: '{s name=overview/edit/shipping_cost}Shipping costs ([0]){/s}',
            shippingCostNet: '{s name=overview/edit/shipping_cost_net}Shipping costs net ([0]){/s}',
            orderState: '{s name=overview/edit/order_status}Order status{/s}',
            paymentState: '{s name=overview/edit/payment_status}Payment status{/s}'
        },
        details: {
            title: '{s name=overview/details/title}Order details{/s}',
            shop: '{s name=overview/details/shop}Shop{/s}',
            language: '{s name=overview/details/language}Language{/s}',
            orderTime: '{s name=overview/details/orderTime}Order time{/s}',
            number: '{s name=overview/details/number}Order number{/s}',
            currency: '{s name=overview/details/currency}Currency{/s}',
            amount: '{s name=overview/details/amount}Total amount{/s}',
            amountEuro: '{s name=overview/details/amount_euro}Total amount (in Euro){/s}',
            dispatch: '{s name=overview/details/dispatch}Chosen shipping type{/s}',
            remoteAddress: '{s name=overview/details/remote_address}IP address{/s}',
            text1: '{s name=overview/details/text_1}Free text 1{/s}',
            text2: '{s name=overview/details/text_2}Free text 2{/s}',
            text3: '{s name=overview/details/text_3}Free text 3{/s}',
            text4: '{s name=overview/details/text_4}Free text 4{/s}',
            text5: '{s name=overview/details/text_5}Free text 5{/s}',
            text6: '{s name=overview/details/text_6}Free text 6{/s}'
        },
        customerDeleted: '{s name=overview/details/customer_deleted_text}Caution: The assigned customer has been deleted.{/s}'
    },

    /**
	 * The initComponent template method is an important initialization step for a Component.
     * It is intended to be implemented by each subclass of Ext.Component to provide any needed constructor logic.
     * The initComponent method of the class being created is called first,
     * with each initComponent method up the hierarchy to Ext.Component being called thereafter.
     * This makes it easy to implement and, if needed, override the constructor logic of the Component at any step in the hierarchy.
     * The initComponent method must contain a call to callParent in order to ensure that the parent class' initComponent method is also called.
	 *
	 * @return void
	 */
    initComponent:function () {
        var me = this;

        me.registerEvents();
        me.items = [
            me.createConvertOrderContainer(),
            me.createCustomerNotification(),
            me.createCustomerInformation(),
            me.createDetailsContainer(),
            me.createEditContainer()
        ];
        me.callParent(arguments);
        me.detailsForm.loadRecord(me.record);
        me.editForm.loadRecord(me.record);
    },

    /**
     * Registers the addition component events.
     */
    registerEvents: function() {
        this.addEvents(

            /**
             * Event will be fired when the user clicks the save button which is displayed on bottom of
             * the form panel.
             *
             * @event
             * @param [Ext.data.Model] - The form record
             */
            'saveOverview',

            /**
             * Event will be fired when the user clicks the "Edit address and payment".
             *
             * @event
             * @param [Ext.data.Model] - The form record
             */
            'showOrderAddress',

            /**
             * Event will be fired when the user clicks the "Save button" button.
             *
             * @event
             * @param [Ext.data.Model]    record - The current form record
             * @param [Ext.window.window] window - The detail window
             */
            'updateForms',

            /**
             * Event will be fired when the users clicks the "Convert order" button
             * @event
             * @param [Ext.data.Model]   record - The current form record
             */
             'convertOrder'
        );
    },

    /**
     * Creates the "convert canceled order" panel showing a short info text and a button
     * @return Ext.panel.Panel
     */
    createConvertOrderPanel: function() {
        var me = this;

        me.canceledOrderMessage = Shopware.Notification.createBlockMessage(me.snippets.convert.message, 'notice');
        me.canceledOrderButton = Ext.create('Ext.button.Button',  {
            text: me.snippets.convert.button,
            cls:'primary',
            handler: function() {
                me.fireEvent('convertOrder', me.record);
            }
        });

        me.canceledOrderContainer = Ext.create('Ext.panel.Panel', {
            title: me.snippets.convert.title,
            bodyPadding: 10,
            flex: 1,
            paddingRight: 5,
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    text: me.snippets.convert.message
                },
                me.canceledOrderButton

            ]
        });
        return me.canceledOrderContainer;

    },

    /**
     * Creates the "convert canceled order container"
     * If the current order is not a canceled order, null is returned
     * @return null|Ext.container.Container
     */
    createConvertOrderContainer: function() {
        var me = this,
            orderId = me.record.get('id'),
            status =  me.record.get('status');

        if ( status !== -1 ) {
            return null;
        }

        me.convertOrderContainer = Ext.create('Ext.container.Container', {
            minWidth:250,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '10 0'
            },
            items: [
                me.createConvertOrderPanel()
            ]
        });
        return me.convertOrderContainer;
    },

    /**
     * If the customer has been deleted a notification will be display on top of the detail page.
     * @return null|Ext.container.Container
     */
    createCustomerNotification: function() {
        var me = this,
            customer = me.record.getCustomer().first();

        if (customer !== Ext.undefined) {
            return null;
        }
        return Shopware.Notification.createBlockMessage(me.snippets.customerDeleted, 'notice');
    },

    /**
     * Creates the container for the three customer info panels
     * @return Ext.container.Container
     */
    createCustomerInformation: function() {
        var me = this;

        me.billingPanel = me.createBillingContainer();
        me.shippingPanel = me.createShippingContainer();
        me.paymentPanel = me.createPaymentContainer();

        me.customerContainer = Ext.create('Ext.container.Container', {
            height: 130,
            minWidth:250,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 5 0 0'
            },
            items: [
                me.billingPanel,
                me.shippingPanel,
                me.paymentPanel
            ]
        });
        return me.customerContainer;
    },

    /**
     * Creates the Ext.panel.Panel for the billing information.
     */
    createBillingContainer: function() {
        var me = this;

        var billing = me.record.getBilling();
        if(billing == null || billing.first() == null) {
            return;
        }

        billing = billing.first();

        return Ext.create('Ext.panel.Panel', {
            title: me.snippets.billing.title,
            bodyPadding: 10,
            flex: 1,
            paddingRight: 5,
            items: [
                {
                    xtype: 'container',
                    renderTpl: me.createBillingTemplate(),
                    renderData: billing.raw
                }
            ]
        });
    },

    /**
     * Creates the XTemplate for the billing information panel
     *
     * @return [Ext.XTemplate] generated Ext.XTemplate
     */
    createBillingTemplate:function () {
        return new Ext.XTemplate(
            '{literal}<tpl for=".">',
                '<div class="customer-info-pnl">',
                    '<div class="base-info">',
                        '<p>',
                            '<span>{company}</span>',
                        '</p>',
                        '<p>',
                            '<span>{firstName}</span>&nbsp;',
                            '<span>{lastName}</span>',
                        '</p>',
                        '<p>',
                            '<span>{street}</span>&nbsp;',
                            '<span>{streetNumber}</span>',
                        '</p>',
                        '<p>',
                            '<span>{zipCode}</span>&nbsp;',
                            '<span>{city}</span>',
                        '</p>',
                        '<tpl for="country">',
                            '<p>',
                                '<span>{name}</span>',
                            '</p>',
                        '</tpl>',
                    '</div>',
                '</div>',

            '</tpl>{/literal}'
        );
    },

    /**
     * Creates the Ext.panel.Panel for the shipping information.
     */
    createShippingContainer: function() {
        var me = this,
            shipping = me.record.getShipping().first();

        if (shipping === Ext.undefined) {
            if(me.record.getBilling() == null || me.record.getBilling().first() == null) {
                return;
            }
            shipping = me.record.getBilling().first();
            if(shipping == null) {
                return ;
            }
        }

        return Ext.create('Ext.panel.Panel', {
            title: me.getShippingPanelTitle(),
            bodyPadding: 10,
            flex: 1,
            style: 'padding: 0 8 0 0 !important;',
            items: [
                {
                    xtype: 'container',
                    renderTpl: me.createShippingTemplate(),
                    renderData:shipping.raw
                }
            ]
        });
    },


    /**
     * Checks if the shipping and billing address is different. If this is the case the panel title
     * if colored red and an icon will be displayed on the right side.
     * @return string
     */
    getShippingPanelTitle: function() {
        var me = this, icon,
            shipping = me.record.getShipping().first(),
            billing = me.record.getBilling();

        if (shipping === Ext.undefined || billing === Ext.undefined || billing.first() === Ext.undefined) {
            return me.snippets.shipping.title;
        }

        billing = billing.first();

        //if the shipping and billing address is different, an exclamation icon will be displayed.
        if (shipping.get('company') != billing.get('company') ||
            shipping.get('firstName') != billing.get('firstName') ||
            shipping.get('lastName') != billing.get('lastName') ||
            shipping.get('street') != billing.get('street') ||
            shipping.get('streetNumber') != billing.get('streetNumber') ||
            shipping.get('zipCode') != billing.get('zipCode')) {

            var helper = new Ext.dom.Helper;
            var iconSpec = {
                tag: 'div',
                cls: 'sprite-exclamation',
                style: 'position: absolute; top: 0; right: 0; data-qwidth="150"; data-qtip="'+ me.snippets.shipping.different +'";'
            };
            var headerSpec = {
                tag: 'span',
                html: me.snippets.shipping.title,
                style: 'color: #ff0000;'
            }

            return helper.markup(headerSpec) +  helper.markup(iconSpec);
        } else {
            return me.snippets.shipping.title;
        }
    },

    /**
     * Creates the XTemplate for the billing information panel
     *
     * @return [Ext.XTemplate] generated Ext.XTemplate
     */
    createShippingTemplate:function () {
        return new Ext.XTemplate(
            '{literal}<tpl for=".">',
                '<div class="customer-info-pnl">',
                    '<div class="base-info">',
                        '<p>',
                            '<span>{company}</span>',
                        '</p>',
                        '<p>',
                            '<span>{firstName}</span>&nbsp;',
                            '<span>{lastName}</span>',
                        '</p>',
                        '<p>',
                            '<span>{street}</span>&nbsp;',
                            '<span>{streetNumber}</span>',
                        '</p>',
                        '<p>',
                            '<span>{zipCode}</span>&nbsp;',
                            '<span>{city}</span>',
                        '</p>',
                        '<tpl for="country">',
                            '<p>',
                                '<span>{name}</span>',
                            '</p>',
                        '</tpl>',
                    '</div>',
                '</div>',

            '</tpl>{/literal}'
        );
    },

    /**
     * Creates the Ext.panel.Panel for the payment information.
     */
    createPaymentContainer: function() {
        var me = this, payment;

        if(me.record && me.record.getPayment() instanceof Ext.data.Store && me.record.getPayment().first() instanceof Ext.data.Model) {
            payment = me.record.getPayment().first();

            return Ext.create('Ext.panel.Panel', {
                title: me.snippets.payment.title,
                bodyPadding: 10,
                flex: 1,
                margin: 0,
                items: [
                    {
                        xtype: 'container',
                        renderTpl: me.createPaymentTemplate(),
                        renderData: payment.raw
                    }
                ]
            });
        } else {
            return;
        }
    },

    /**
     * Creates the XTemplate for the billing information panel
     *
     * @return [Ext.XTemplate] generated Ext.XTemplate
     */
    createPaymentTemplate:function () {
        return new Ext.XTemplate(
            '{literal}<tpl for=".">',
                '<div class="customer-info-pnl">',
                    '<div class="base-info">',
                        '<p>',
                            '<span>{description}</span>',
                        '</p>',
                    '</div>',
                '</div>',
            '</tpl>{/literal}'
        );
    },

    /**
     * Creates the container for the detail form panel.
     * @return Ext.form.Panel
     */
    createDetailsContainer: function() {
        var me = this;

        me.detailsForm = Ext.create('Ext.form.Panel', {
            title: me.snippets.details.title,
            bodyPadding: 10,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            margin: '10 0',
            items: [
                me.createInnerDetailContainer()
            ]
        });
        return me.detailsForm;
    },

    /**
     * Creates the outer container for the detail panel which
     * has a column layout to display the detail information in two columns.
     *
     * @return Ext.container.Container
     */
    createInnerDetailContainer: function() {
        var me = this;

        return Ext.create('Ext.container.Container', {
            layout: 'column',
            items: [
                me.createDetailElementContainer(me.createLeftDetailElements()),
                me.createDetailElementContainer(me.createRightDetailElements())
            ]
        });
    },

    /**
     * Creates the column container for the detail elements which displayed
     * in two columns.
     * @param [array] items - The container items.
     */
    createDetailElementContainer: function(items) {
        return Ext.create('Ext.container.Container', {
            columnWidth: 0.5,
            defaults: {
                xtype: 'displayfield',
                labelWidth: 155
            },
            items: items
        });
    },

    /**
     * Creates the elements for the left column container which displays the
     * fields in two columns.
     * @return array - Contains the form fields
     */
    createLeftDetailElements: function() {
        var me = this, fields;
        fields = [
            { name:'shop[name]', fieldLabel:me.snippets.details.shop },
            { name:'locale[name]', fieldLabel:me.snippets.details.language},
            { name:'orderTime',fieldLabel:me.snippets.details.orderTime },
            { name:'number', fieldLabel:me.snippets.details.number },
            { name:'currency', fieldLabel:me.snippets.details.currency },
            { name:'invoiceAmount', fieldLabel:me.snippets.details.amount, renderer: me.renderInvoiceAmount },
            { name:'dispatch[name]', fieldLabel:me.snippets.details.dispatch }
        ];
        if (me.record.get('currencyFactor') !== 1) {
            fields.push({ name:'invoiceAmountEuro', fieldLabel:me.snippets.details.amountEuro, renderer: me.renderInvoiceAmount });
        }
        return fields;
    },

    /**
     * Render function of the invoiceAmount display field
     * @param value
     * @return string
     */
    renderInvoiceAmount: function(value) {
        if ( value === Ext.undefined ) {
            return value;
        }
        return Ext.util.Format.currency(value);
    },

    /**
     * Creates the elements for the right column container which displays the
     * fields in two columns.
     * @return array - Contains the form fields
     */
    createRightDetailElements:function () {
        var me = this;

        return [
            {  name:'remoteAddressConverted', fieldLabel:me.snippets.details.remoteAddress },
            {  name:'attribute[attribute1]', fieldLabel:me.snippets.details.text1 },
            {  name:'attribute[attribute2]', fieldLabel:me.snippets.details.text2 },
            {  name:'attribute[attribute3]', fieldLabel:me.snippets.details.text3 },
            {  name:'attribute[attribute4]', fieldLabel:me.snippets.details.text4 },
            {  name:'attribute[attribute5]', fieldLabel:me.snippets.details.text5 },
            {  name:'attribute[attribute6]', fieldLabel:me.snippets.details.text6 }
        ];
    },

    /**
     * Creates the container for the editable fields which displayed
     * on bottom of the detail tab panel.
     * @return Ext.form.Panel
     */
    createEditContainer: function() {
        var me = this;

        me.editForm = Ext.create('Ext.form.Panel', {
            title: me.snippets.edit.title,
            bodyPadding: 10,
            layout: 'anchor',
            background: '#fff',
            defaults: {
                anchor: '100%',
                labelWidth: 155
            },
            items: me.createEditElements(),
            buttons: me.getEditFormButtons()
        });
        return me.editForm;
    },

    /**
     * Creates the save and cancel button for the form panel.
     * @return [array] - Contains the cancel button and the save button
     */
    getEditFormButtons: function() {
        var me = this,
            buttons = [];

        var cancelButton = Ext.create('Ext.button.Button', {
            text: me.snippets.edit.cancel,
            scope:me,
            cls: 'secondary',
            handler:function () {
                me.record.reject();
                me.loadRecord(me.record);
            }
        });
        buttons.push(cancelButton);

        var saveButton = Ext.create('Ext.button.Button', {
            text:me.snippets.edit.save,
            action:'save-order',
            cls:'primary',
            handler: function() {
                me.editForm.getForm().updateRecord(me.record);
                me.fireEvent('saveOverview', me.record, {
                    callback: function(order) {
                        me.fireEvent('updateForms', order, me.up('window'));
                    }
                });
            }
        });

        //Create a order? Then display only the form panel
        if ( !me.record.get('id') ) {
            buttons.push(saveButton);
        } else {
            /*{if {acl_is_allowed privilege=update}}*/
                buttons.push(saveButton);
            /*{/if}*/
        }
        return buttons;
    },

    /**
     * Creates the elements for the edit container which displayed
     * on bottom of the detail tab panel.
     *
     * @return array - Contains the different form fields
     */
    createEditElements: function() {
        var me = this;

        me.orderStatusStore.filterBy(function(item) { return item.get("id") > 0; });

        return [
            {
                xtype: 'datefield',
                name: 'clearedDate',
                submitFormat: 'd.m.Y',
                fieldLabel: me.snippets.edit.clearedDate
            },
            {
                xtype: 'textfield',
                name: 'trackingCode',
                fieldLabel: me.snippets.edit.trackingCode
            },
            {
                xtype: 'numberfield',
                decimalPrecision: 2,
                submitLocaleSeparator: false,
                name: 'invoiceShipping',
                fieldLabel: Ext.String.format(me.snippets.edit.shippingCost, me.record.get('currency'))
            },
            {
                xtype: 'numberfield',
                decimalPrecision: 2,
                submitLocaleSeparator: false,
                name: 'invoiceShippingNet',
                fieldLabel: Ext.String.format(me.snippets.edit.shippingCostNet, me.record.get('currency'))
            },
            {
                xtype: 'combobox',
                queryMode: 'local',
                name: 'status',
                dataIndex: 'status',
                fieldLabel: me.snippets.edit.orderState,
                store: me.orderStatusStore,
                displayField: 'description',
                valueField: 'id'
            },
            {
                xtype: 'combobox',
                queryMode: 'local',
                name: 'cleared',
                fieldLabel: me.snippets.edit.paymentState,
                store: me.paymentStatusStore,
                displayField: 'description',
                valueField: 'id'
            }
        ];
    }

});
//{/block}
